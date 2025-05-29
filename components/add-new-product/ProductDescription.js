import React, { useState } from 'react'
import DynamicEditor from '../ck-editor/DynamicEditor';
const ProductDescription = () => {
    const [descriptionBtn, setDescriptionBtn] = useState(false);

    const handleDescriptionBtn = () => {
      setDescriptionBtn(!descriptionBtn);
    };
  
  return (
    <div className="panel mb-30">
        <div className="panel-header">
            <h5>Product Description</h5>
            <div className="btn-box d-flex gap-2">
                <button className="btn btn-sm btn-icon btn-outline-primary"><i className="fa-light fa-arrows-rotate"></i></button>
                <button className="btn btn-sm btn-icon btn-outline-primary panel-close" onClick={handleDescriptionBtn}><i className="fa-light fa-angle-up"></i></button>
            </div>
        </div>
        <div className={`panel-body ${descriptionBtn ? 'd-none' : ''}`}>
          <DynamicEditor/>
        </div>
    </div>
  )
}

export default ProductDescription