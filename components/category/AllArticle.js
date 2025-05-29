import React from "react";
import ArticleTable from "../tables/ArticleTable";

const AllArticle = () => {
  return (
    <div className="col-xxl-12 col-md-7">
      <div className="panel">
        <div className="panel-header">
          <h5>All Articles</h5>
        </div>
        <div className="panel-body">
          <ArticleTable />
        </div>
      </div>
    </div>
  );
};

export default AllArticle;
