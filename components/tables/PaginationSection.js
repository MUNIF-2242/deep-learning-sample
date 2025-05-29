import React from 'react'

const PaginationSection = ({currentPage,totalPages,paginate,pageNumbers}) => {
  return (
    <div className="table-bottom-control">
        <div className="dataTables_info">Showing {currentPage} to {totalPages} of {totalPages}</div>
         <div className="dataTables_paginate paging_simple_numbers">
            <a 
            className={`btn btn-primary previous ${currentPage === 1 ? 'disabled' : ''}`}
            role='button'
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            >
                <i className="fa-light fa-angle-left"></i>
            </a>
            {pageNumbers.map((number, index) => (
            <span key={index}>
                <a 
                className={`btn btn-primary ${currentPage === number ? 'current' : ''}`}
                role='button'
                onClick={() => paginate(number)}
                >{number}</a>
            </span>
                ))}
            <a 
            className={`btn btn-primary next disabled ${currentPage === totalPages ? 'disabled' : ''}`}
            role='button'
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            >
                <i className="fa-light fa-angle-right"></i>
            </a>
        </div>
    </div>    
  )
}

export default PaginationSection