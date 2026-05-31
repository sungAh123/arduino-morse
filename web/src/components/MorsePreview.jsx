export default function MorsePreview({ morse }) {
    return (
        <div>
            <h3>Morse Code Preview</h3>
            <p>{morse || 'No morse code to display'}</p>
        </div>
    );
}