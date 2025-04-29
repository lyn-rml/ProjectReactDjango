import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import {BrowserRouter,Routes,Route} from 'react-router-dom'
import CS from './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRouter from './App';
import { BrowserRouter } from 'react-router-dom';
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Welcome />}>
//           <Route index element={<Home />} />
//           <Route path="blogs" element={<Blogs />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="*" element={<NoPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(
  // <React.StrictMode>
   // <App />
  // </React.StrictMode>
//);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
<AppRouter /></BrowserRouter>);
