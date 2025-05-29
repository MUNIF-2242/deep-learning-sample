import React from 'react'
import DynamicEditor from '../ck-editor/DynamicEditor';
const RichTextEditorSection = () => {
  return (
    <div className="col-12">
        <div className="panel">
            <div className="panel-header">
                <h5>Rich Text Editor</h5>
            </div>
            <div className="panel-body">
                <div className="editor">
                    <DynamicEditor/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RichTextEditorSection