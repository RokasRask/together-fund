import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './Components/Main';
import Nav from './Components/Nav';
import Wrapper from './Components/Wrapper';
import { Auth } from './Contexts/Auth';
import { Data } from './Contexts/Data';
import { Router } from './Contexts/Router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Style/Template/css/bootstrap.css'; // Import Bootstrap CSS
import './Style/Template/css/style.css'; // Import custom CSS
import './Style/Template/css/responsive.css'; // Import responsive CSS

export default function App() {

  return (
    <Router>
      <Auth>
        <Data>
          <Wrapper>
            <Nav />
            <Main />
            <ToastContainer />
          </Wrapper>
        </Data>
      </Auth>
    </Router>
  );
}