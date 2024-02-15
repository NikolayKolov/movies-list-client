/* eslint-disable @typescript-eslint/no-explicit-any */
type DeleteMovieProps = {
    message?: string;
    status: 'idle' | 'deleting' | 'success' | 'error';
    handleCloseDeleteModal: (...args: any[]) => any;
    handleMovieDelete: (...args: any[]) => any;
}

const DeleteMovieModal = (props: DeleteMovieProps) => {
    const {message, status = 'idle', handleCloseDeleteModal, handleMovieDelete} = props;

    return (
        <article className="modal--delete">
            <p>{message}</p>
            <div>
                <button onClick={handleCloseDeleteModal} disabled={status === 'deleting'}>
                    {
                        status === 'success' ? 'Close' : 'Cancel'
                    }
                </button>
                {
                    status === 'idle' || status === 'deleting' ?
                        <button className="button__delete" onClick={handleMovieDelete} disabled={status === 'deleting'}>Delete</button> :
                        null
                }
            </div>
        </article>
    );
}

export default DeleteMovieModal;