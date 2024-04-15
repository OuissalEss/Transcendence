import '../assets/loading.css';
import '../App.css';

const Loading = () => {
    return (
        <div className="containerL p-6" >
            <div className="">
                <div className="gifL">
                    <img className="imageL" src="/loading.gif" alt="Loading" referrerPolicy="no-referrer"/>
                    <h1 className="text-loadingL">Almost there, just a moment . . .</h1>
                </div>
            </div>
        </div>
    );
}

export default Loading;

