import { useRef, useState } from 'react';
import { fileToDataUrl } from '../lib/images';
import './ImagePicker.css';

export function ImagePicker({
  label = 'Add photo',
  value,
  onChange,
  round = false,
  tall = false,
}: {
  label?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  round?: boolean;
  tall?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await fileToDataUrl(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-picker">
      <button
        type="button"
        className={`image-picker-btn${round ? ' is-round' : ''}${tall ? ' is-tall' : ''}${value ? ' has-image' : ''}`}
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {value ? (
          <img src={value} alt="" />
        ) : (
          <span>{busy ? 'Preparing…' : label}</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error && <p className="image-picker-error">{error}</p>}
    </div>
  );
}
