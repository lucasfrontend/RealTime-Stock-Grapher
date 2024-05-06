import ReactPaginate from 'react-paginate';

const CustomPaginator = ({ pageCount, handlePageClick }) => {
  return (
    <ReactPaginate
      previousLabel={'Anterior'}
      nextLabel={'Siguiente'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'pagination justify-content-center'}
      activeClassName={'active'}
      previousClassName={'page-item'}
      nextClassName={'page-item'}
      breakClassName={'page-item'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousLinkClassName={'page-link'}
      nextLinkClassName={'page-link'}
      breakLinkClassName={'page-link'}
      disabledClassName={'disabled'}
    />
  );
};

export default CustomPaginator;