import { useState, useRef } from 'react';

export default function Assignment_5() {
  const [text, setText] = useState(''); // store the text inside textarea
  const fileHandleRef = useRef(null); // store selected file handle

  // open a file
  const handleOpen = async () => {
    try {
      // show open file picker
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
        multiple: false,
      });

      fileHandleRef.current = handle;
      // read file content
      const file = await handle.getFile();
      const contents = await file.text();

      // display file text inside textarea
      setText(contents);
    } catch (err) {
      console.error('Error opening file:', err);
    }
  };

  // save the file
  const handleSave = async () => {
    try {
      let handle = fileHandleRef.current;

      // if no file was opened - show Save As instead
      if (!handle) {
        handle = await window.showSaveFilePicker({
          types: [
            {
              description: 'Text Files',
              accept: { 'text/plain': ['.txt'] },
            },
          ],
          suggestedName: 'new-file.txt',
        });
        fileHandleRef.current = handle;
      }
      // open file for writing
      const writable = await handle.createWritable();

      // write text into file
      await writable.write(text);

      // finish writing and save
      await writable.close();
    } catch (err) {
      console.error('Error saving file:', err);
    }
  };

  // close editor
  const handleClose = () => {
    setText('');
    fileHandleRef.current = null; // remove file handle
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Simple Text Editor</h2>
      <textarea
        style={{ width: '50%', height: '150px' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div style={{ marginTop: '16px' }}>
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave} style={{ marginLeft: '8px' }}>
          Save
        </button>
        <button onClick={handleClose} style={{ marginLeft: '8px' }}>
          Close
        </button>
      </div>
    </div>
  );
}

