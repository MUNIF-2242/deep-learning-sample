import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { DigiContext } from "@/context/DigiContext";

const NewBranch = () => {
  const { addBranch, districts } = useContext(DigiContext);
  const router = useRouter();
  const { bankCode } = router.query;
  const [formData, setFormData] = useState({
    districtCode: "",
    branchName: "",
    branchCode: "",
    routingNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBranch = {
      ...formData,
      bankCode,
    };

    const result = await addBranch(newBranch); // Use context's addBranch function
    if (result.success) {
      alert("Branch added successfully");
    } else {
      alert(`${result.message}`); // Show error message returned by context
    }
    // setFormData({
    //   branchName: "",
    //   branchCode: "",
    //   districtCode: "",
    //   bankCode: "",
    //   routingNumber: "",
    // });
  };
  return (
    <div className="col-xxl-4 col-md-6">
      <div className="panel">
        <div className="panel-header">
          <h5>Add Branch</h5>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-12">
                <label htmlFor="inputWithPlaceholder" className="form-label">
                  District Name
                </label>
                <select
                  className="form-select"
                  id="autoSizingSelect"
                  name="districtCode"
                  value={formData.districtCode}
                  onChange={handleChange}
                >
                  <option defaultValue>Select district</option>
                  {districts.map((district) => (
                    <option
                      key={district.districtCode}
                      value={district.districtCode}
                    >
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-12">
                <label htmlFor="inputWithPlaceholder" className="form-label">
                  Branch Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="branchName"
                  placeholder="Enter branch name"
                  value={formData.branchName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-12">
                <label htmlFor="inputWithPlaceholder" className="form-label">
                  Branch Code
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="branchCode"
                  placeholder="Enter branch code"
                  value={formData.branchCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-12">
                <label htmlFor="inputWithPlaceholder" className="form-label">
                  Routing Number
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="routingNumber"
                  placeholder="Enter routing number"
                  value={formData.routingNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBranch;
