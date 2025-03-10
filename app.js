let model;
let video;
let canvas;
let uploadedImage;
let stream;

// Load the model when the page loads
window.addEventListener('load', async () => {
    try {
        // Force CPU backend if WebGL is not available
        await tf.setBackend('cpu');
        model = await mobilenet.load({
            version: 2,
            alpha: 1.0
        });
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Error loading the recognition model. Please make sure you have a stable internet connection and try refreshing the page.');
    }
});

// Start camera function
async function startCamera() {
    try {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        uploadedImage = document.getElementById('uploadedImage');

        // Hide upload image and show video
        uploadedImage.classList.add('hidden');
        canvas.classList.add('hidden');
        video.classList.remove('hidden');

        // Show capture button
        document.getElementById('captureBtn').classList.remove('hidden');

        // Get camera stream
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Error accessing camera. Please make sure you have granted camera permissions.');
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            video = document.getElementById('video');
            canvas = document.getElementById('canvas');
            uploadedImage = document.getElementById('uploadedImage');

            // Hide video and canvas, show uploaded image
            video.classList.add('hidden');
            canvas.classList.add('hidden');
            uploadedImage.classList.remove('hidden');

            // Hide capture button
            document.getElementById('captureBtn').classList.add('hidden');

            // Set image source and analyze
            uploadedImage.src = e.target.result;
            uploadedImage.onload = () => analyzeImage(uploadedImage);
        };
        reader.readAsDataURL(file);
    }
}

// Capture image from camera
function captureImage() {
    canvas = document.getElementById('canvas');
    video = document.getElementById('video');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Hide video and show canvas
    video.classList.add('hidden');
    canvas.classList.remove('hidden');

    // Stop camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // Hide capture button
    document.getElementById('captureBtn').classList.add('hidden');

    // Analyze the captured image
    analyzeImage(canvas);
}

// Analyze image using the model
async function analyzeImage(imageElement) {
    try {
        // Show loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        const results = document.getElementById('results');
        const resultContent = document.getElementById('resultContent');

        loadingIndicator.classList.remove('hidden');
        results.classList.remove('hidden');
        resultContent.innerHTML = '';

        // Get predictions
        const predictions = await model.classify(imageElement);

        // Create results HTML
        let resultsHTML = '<div class="space-y-4">';
        predictions.forEach((prediction, index) => {
            const percentage = (prediction.probability * 100).toFixed(2);
            resultsHTML += `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-medium text-gray-800">${prediction.className}</h3>
                        <span class="text-sm font-medium text-blue-600">${percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600">Common uses and characteristics will be displayed here.</p>
                </div>
            `;
        });
        resultsHTML += '</div>';

        // Update results
        resultContent.innerHTML = resultsHTML;
    } catch (error) {
        console.error('Error analyzing image:', error);
        resultContent.innerHTML = '<p class="text-red-500">Error analyzing image. Please try again.</p>';
    } finally {
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
    }
}
