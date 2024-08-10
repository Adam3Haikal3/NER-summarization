import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
    try {
        const { text, args } = await request.json();

        // Convert the args object to a base64 encoded string
        const argsBase64 = Buffer.from(JSON.stringify(args)).toString('base64');

        // Escape the text for shell command
        const escapedText = text.replace(/"/g, '\\"');

        const command = `python3 summarizer.py "${escapedText}" ${argsBase64}`;

        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            console.error('Python script error:', stderr);
            return new Response(JSON.stringify({ error: 'An error occurred while summarizing the text.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ summary: stdout.trim() }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('API route error:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}