import { DigiContext } from '@/context/DigiContext';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react'
const Editor = dynamic(
    () => import('../ck-editor/CkEditor'), // Path to your CKEditor component
    { ssr: false } // Ensure CKEditor is only loaded on the client side
  );
const DynamicEditor = () => {
    const {editorData,handleEditorDataChange,editorVisible} = useContext(DigiContext)
  return (
    <>
    {editorVisible && <Editor initialData={editorData} onDataChanged={handleEditorDataChange} />}
    </>
  )
}

export default DynamicEditor