import Header from './components/Header';
import News from './components/News';
import Footer from './components/Footer';
import { Provider } from 'react-redux';
import { store } from './app/store';

const App = () => {
  return (
    <Provider store={store}>
      <Header />
      <News />
      <Footer />
    </Provider>
  );
};

export default App;
