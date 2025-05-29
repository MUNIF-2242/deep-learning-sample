import React from "react";

const EditImageFileInputSection = ({ setImage }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;

        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      <div className="panel">
        <div className="panel-header">
          <h5>Upload Image</h5>
        </div>
        <div className="panel-body">
          <form>
            <div className="row g-3">
              <div className="col-sm-12">
                <label htmlFor="formFile" className="form-label">
                  Upload Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  accept=".jpeg, .jpg, .png"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditImageFileInputSection;
