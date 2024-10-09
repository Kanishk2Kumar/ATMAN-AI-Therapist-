import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public'))); // Ensure this folder exists

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure this file exists
});

// Route to render AI.html
app.get('/AI', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'AI.html')); // Ensure this file exists
});

// Route to handle AI prompt
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Generate the response using the AI model
        const response = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
        
        res.json({ generatedText: response.response.text() }); // Send the generated text
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message }); // Send error details for debugging
    }
});

// Export as a Vercel serverless function
export default app;

// Start the server for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}
