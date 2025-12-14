"""
Tkinter UI for ASL Recognition App
Displays camera feed and real-time predictions
"""
import os
import sys
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import cv2
from PIL import Image, ImageTk
import threading
import time

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from src.pipeline import ASLPipeline
from utils import config


class ASLRecognitionUI:
    """Tkinter UI for ASL Recognition"""
    
    def __init__(self, window_title: str = "ASL Alphabet Recognition"):
        """Initialize UI"""
        self.window_title = window_title
        
        # Create main window
        self.root = tk.Tk()
        self.root.title(self.window_title)
        self.root.geometry(f"{config.WINDOW_WIDTH}x{config.WINDOW_HEIGHT}")
        self.root.resizable(True, True)
        
        # State variables
        self.camera = None
        self.pipeline = None
        self.is_running = False
        self.current_frame = None
        self.fps = 0
        self.frame_count = 0
        self.start_time = time.time()
        self.mirror_camera = tk.BooleanVar(value=True)  # Mirror by default
        self.use_hand_detection = tk.BooleanVar(value=True)  # Hand detection enabled by default
        
        # Create UI components
        self._create_ui()
        
        # Bind window close event
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def _create_ui(self):
        """Create UI components"""
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(0, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="ASL Alphabet Recognition", 
                               font=('Arial', 20, 'bold'))
        title_label.grid(row=0, column=0, pady=10)
        
        # Video frame
        self.video_frame = ttk.Label(main_frame, relief=tk.SOLID, borderwidth=2)
        self.video_frame.grid(row=1, column=0, pady=10, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Info frame
        info_frame = ttk.LabelFrame(main_frame, text="Recognition Info", padding="10")
        info_frame.grid(row=2, column=0, pady=10, sticky=(tk.W, tk.E))
        info_frame.columnconfigure(1, weight=1)
        
        # Hand detection status
        ttk.Label(info_frame, text="Hand Detected:", font=('Arial', 12)).grid(row=0, column=0, sticky=tk.W, padx=5)
        self.hand_status_label = ttk.Label(info_frame, text="No", font=('Arial', 12, 'bold'), foreground='red')
        self.hand_status_label.grid(row=0, column=1, sticky=tk.W, padx=5)
        
        # Predicted letter
        ttk.Label(info_frame, text="Predicted Letter:", font=('Arial', 12)).grid(row=1, column=0, sticky=tk.W, padx=5)
        self.letter_label = ttk.Label(info_frame, text="-", font=('Arial', 32, 'bold'), foreground='blue')
        self.letter_label.grid(row=1, column=1, sticky=tk.W, padx=5)
        
        # Confidence
        ttk.Label(info_frame, text="Confidence:", font=('Arial', 12)).grid(row=2, column=0, sticky=tk.W, padx=5)
        self.confidence_label = ttk.Label(info_frame, text="0%", font=('Arial', 14, 'bold'))
        self.confidence_label.grid(row=2, column=1, sticky=tk.W, padx=5)
        
        # FPS
        ttk.Label(info_frame, text="FPS:", font=('Arial', 12)).grid(row=3, column=0, sticky=tk.W, padx=5)
        self.fps_label = ttk.Label(info_frame, text="0", font=('Arial', 12))
        self.fps_label.grid(row=3, column=1, sticky=tk.W, padx=5)
        
        # Debug info
        ttk.Label(info_frame, text="Debug:", font=('Arial', 10)).grid(row=4, column=0, sticky=tk.W, padx=5)
        self.debug_label = ttk.Label(info_frame, text="-", font=('Arial', 10), foreground='gray')
        self.debug_label.grid(row=4, column=1, sticky=tk.W, padx=5)
        
        # Control buttons frame
        button_frame = ttk.Frame(main_frame, padding="10")
        button_frame.grid(row=3, column=0, pady=10)
        
        # Start button
        self.start_button = ttk.Button(button_frame, text="Start Camera", 
                                      command=self.start_camera, width=15)
        self.start_button.grid(row=0, column=0, padx=5)
        
        # Stop button
        self.stop_button = ttk.Button(button_frame, text="Stop Camera", 
                                     command=self.stop_camera, width=15, state=tk.DISABLED)
        self.stop_button.grid(row=0, column=1, padx=5)
        
        # Capture button
        self.capture_button = ttk.Button(button_frame, text="Capture Image", 
                                        command=self.capture_image, width=15, state=tk.DISABLED)
        self.capture_button.grid(row=0, column=2, padx=5)
        
        # Mirror checkbox
        self.mirror_checkbox = ttk.Checkbutton(button_frame, text="Mirror Camera",
                                              variable=self.mirror_camera)
        self.mirror_checkbox.grid(row=0, column=3, padx=5)
        
        # Hand Detection checkbox
        self.hand_detection_checkbox = ttk.Checkbutton(button_frame, text="Use Hand Detection",
                                                      variable=self.use_hand_detection)
        self.hand_detection_checkbox.grid(row=0, column=4, padx=5)
        
        # Test with Image button (second row)
        self.test_image_button = ttk.Button(button_frame, text="Test with Image",
                                           command=self.test_with_image, width=15)
        self.test_image_button.grid(row=1, column=0, columnspan=2, padx=5, pady=5)
        
        # Status bar
        self.status_label = ttk.Label(main_frame, text="Ready to start", 
                                     relief=tk.SUNKEN, anchor=tk.W)
        self.status_label.grid(row=4, column=0, sticky=(tk.W, tk.E), pady=5)
    
    def start_camera(self):
        """Start camera and pipeline"""
        try:
            self.status_label.config(text="Initializing camera and model...")
            self.root.update()
            
            # Initialize camera
            self.camera = cv2.VideoCapture(config.CAMERA_INDEX)
            self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, config.CAMERA_WIDTH)
            self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, config.CAMERA_HEIGHT)
            
            if not self.camera.isOpened():
                raise Exception("Could not open camera")
            
            # Initialize pipeline
            self.pipeline = ASLPipeline()
            
            # Update UI state
            self.is_running = True
            self.start_button.config(state=tk.DISABLED)
            self.stop_button.config(state=tk.NORMAL)
            self.capture_button.config(state=tk.NORMAL)
            
            # Start video loop
            self.status_label.config(text="Camera running...")
            self.frame_count = 0
            self.start_time = time.time()
            self.update_video()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start camera:\n{str(e)}")
            self.status_label.config(text=f"Error: {str(e)}")
            self.cleanup()
    
    def stop_camera(self):
        """Stop camera and pipeline"""
        self.is_running = False
        self.cleanup()
        
        # Update UI state
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        self.capture_button.config(state=tk.DISABLED)
        self.status_label.config(text="Camera stopped")
        
        # Clear video frame
        self.video_frame.config(image='')
        
        # Reset info labels
        self.hand_status_label.config(text="No", foreground='red')
        self.letter_label.config(text="-")
        self.confidence_label.config(text="0%")
        self.fps_label.config(text="0")
    
    def update_video(self):
        """Update video frame"""
        if not self.is_running:
            return
        
        try:
            # Read frame
            ret, frame = self.camera.read()
            
            if ret:
                # Optionally flip frame horizontally (mirror) for correct hand orientation
                if self.mirror_camera.get():
                    frame = cv2.flip(frame, 1)
                
                # Process frame through pipeline
                result = self.pipeline.process_frame(frame, use_hand_detection=self.use_hand_detection.get())
                
                # Get annotated frame
                display_frame = result['annotated_frame']
                
                # Update info labels
                if result['hand_detected']:
                    self.hand_status_label.config(text="Yes ✓", foreground='green')
                    
                    # Update debug info
                    debug_msg = f"Conf: {result['confidence']:.2f}"
                    if 'method' in result:
                        debug_msg += f" | Method: {result.get('method', 'N/A')}"
                    self.debug_label.config(text=debug_msg)
                    
                    if result['predicted_letter']:
                        self.letter_label.config(text=result['predicted_letter'])
                        confidence_pct = f"{result['confidence']:.1%}"
                        self.confidence_label.config(text=confidence_pct)
                        
                        # Color code confidence
                        if result['confidence'] >= 0.9:
                            self.confidence_label.config(foreground='green')
                        elif result['confidence'] >= 0.7:
                            self.confidence_label.config(foreground='orange')
                        else:
                            self.confidence_label.config(foreground='red')
                else:
                    self.hand_status_label.config(text="No", foreground='red')
                    self.letter_label.config(text="-")
                    self.confidence_label.config(text="0%", foreground='black')
                
                # Calculate FPS
                self.frame_count += 1
                elapsed = time.time() - self.start_time
                if elapsed > 1.0:
                    self.fps = self.frame_count / elapsed
                    self.fps_label.config(text=f"{self.fps:.1f}")
                    self.frame_count = 0
                    self.start_time = time.time()
                
                # Convert frame for display
                display_frame = cv2.cvtColor(display_frame, cv2.COLOR_BGR2RGB)
                display_frame = cv2.resize(display_frame, (640, 480))
                
                # Convert to PhotoImage
                img = Image.fromarray(display_frame)
                imgtk = ImageTk.PhotoImage(image=img)
                
                # Update video frame
                self.video_frame.imgtk = imgtk
                self.video_frame.config(image=imgtk)
                
                # Store current frame
                self.current_frame = frame
        
        except Exception as e:
            print(f"Error in update_video: {str(e)}")
            self.status_label.config(text=f"Error: {str(e)}")
        
        # Schedule next update
        if self.is_running:
            self.root.after(10, self.update_video)
    
    def capture_image(self):
        """Capture current frame to file"""
        if self.current_frame is not None:
            try:
                # Create captures directory
                captures_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "captures")
                os.makedirs(captures_dir, exist_ok=True)
                
                # Generate filename
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"capture_{timestamp}.jpg"
                filepath = os.path.join(captures_dir, filename)
                
                # Save image
                cv2.imwrite(filepath, self.current_frame)
                
                messagebox.showinfo("Success", f"Image saved to:\n{filepath}")
                self.status_label.config(text=f"Image saved: {filename}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save image:\n{str(e)}")
    
    def test_with_image(self):
        """Test ASL recognition with an uploaded image"""
        try:
            # Open file dialog
            file_path = filedialog.askopenfilename(
                title="Select an image to test",
                filetypes=[
                    ("Image files", "*.jpg *.jpeg *.png *.bmp"),
                    ("All files", "*.*")
                ]
            )
            
            if not file_path:
                return  # User cancelled
            
            # Read the image
            image = cv2.imread(file_path)
            
            if image is None:
                messagebox.showerror("Error", "Failed to load image")
                return
            
            # Initialize pipeline if not already done
            if self.pipeline is None:
                self.status_label.config(text="Initializing model...")
                self.root.update()
                self.pipeline = ASLPipeline()
            
            # Apply mirror if checked
            if self.mirror_camera.get():
                image = cv2.flip(image, 1)
            
            # Process image through pipeline
            result = self.pipeline.process_frame(image, use_hand_detection=self.use_hand_detection.get())
            
            # Display the result image
            display_frame = result['annotated_frame']
            display_frame = cv2.cvtColor(display_frame, cv2.COLOR_BGR2RGB)
            display_frame = cv2.resize(display_frame, (640, 480))
            
            img = Image.fromarray(display_frame)
            imgtk = ImageTk.PhotoImage(image=img)
            
            self.video_frame.imgtk = imgtk
            self.video_frame.config(image=imgtk)
            
            # Update info labels
            if result['hand_detected']:
                self.hand_status_label.config(text="Yes ✓", foreground='green')
                
                if result['predicted_letter']:
                    self.letter_label.config(text=result['predicted_letter'])
                    confidence_pct = f"{result['confidence']:.1%}"
                    self.confidence_label.config(text=confidence_pct)
                    
                    # Color code confidence
                    if result['confidence'] >= 0.9:
                        self.confidence_label.config(foreground='green')
                    elif result['confidence'] >= 0.7:
                        self.confidence_label.config(foreground='orange')
                    else:
                        self.confidence_label.config(foreground='red')
                    
                    self.status_label.config(text=f"Tested image: {os.path.basename(file_path)}")
            else:
                self.hand_status_label.config(text="No", foreground='red')
                self.letter_label.config(text="-")
                self.confidence_label.config(text="0%", foreground='black')
                self.status_label.config(text="No hand detected in image")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to process image:\n{str(e)}")
            self.status_label.config(text=f"Error: {str(e)}")
    
    def cleanup(self):
        """Cleanup resources"""
        if self.camera:
            self.camera.release()
            self.camera = None
        
        if self.pipeline:
            self.pipeline.close()
            self.pipeline = None
    
    def on_closing(self):
        """Handle window close event"""
        if self.is_running:
            self.stop_camera()
        
        self.cleanup()
        self.root.destroy()
    
    def run(self):
        """Run the application"""
        self.root.mainloop()


if __name__ == "__main__":
    app = ASLRecognitionUI()
    app.run()
