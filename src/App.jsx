import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Article from './pages/Article';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import SearchResults from './pages/SearchResults';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="body-offset">
                <Home />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/post/:id"
          element={
            <>
              <Navbar />
              <div className="body-offset">
                <Article />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/category/:name"
          element={
            <>
              <Navbar />
              <div className="body-offset">
                <CategoryPage />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/tag/:name"
          element={
            <>
              <Navbar />
              <div className="body-offset">
                <TagPage />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <Navbar />
              <div className="body-offset">
                <SearchResults />
              </div>
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="new" element={<PostEditor />} />
          <Route path="edit/:id" element={<PostEditor />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
