import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CkEditor = ({ initialData, onDataChanged }) => {

  return (
    <div className="editor">
      <CKEditor
        editor={ClassicEditor}
        data={initialData}
        onChange={(event, editor) => {
          const data = editor.getData();
          onDataChanged(data);
        }}
      />
    </div>
  );
};

export default CkEditor;
