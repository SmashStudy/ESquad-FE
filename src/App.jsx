import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Home from "./pages/home/Home.jsx";
import Join from "./pages/join/Join";
import Login from "./pages/login/Login";
import StudyPage from "./pages/team/StudyPage.jsx";
import { UserProvider } from '/src/components/form/UserContext.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import PostListPage from "./pages/community/PostListPage.jsx";
import StudyListPage from "./pages/team/StudyListPage.jsx";
import BookListPage from "./pages/team/BookListPage.jsx";
import BookDetailPage from "./pages/team/BookDetailPage.jsx";
import StudyDetailPage from "./pages/team/StudyDetailPage.jsx";
import PostDetailsPage from "./pages/community/PostDetailsPage.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import FindPassword from "./components/form/FindPassword.jsx";
import FindUsername from "./components/form/FindUsername.jsx";
import UserPasswordUpdate from "./components/user/UserPasswordUpdate.jsx";
import UserUpdate from "./components/user/UserUpdate.jsx";
import UserInquiry from "./components/user/UserInquiry.jsx";
import PostEditPage  from "./pages/community/PostEditPage.jsx";

const theme = createTheme({
    palette: {
        primary: {
            main: '#9f51e8', // Home color
            light: '#ac71e5',
        },
        secondary: {
            main: '#0095ff', // Emphasis color
        },
        warning: {
            main: '#f51738',
        },
        background: {
            default: '#F0F0F0', // Background color
            paper: '#FFFFFF', // Sub color for cards
            gray: '#e0dddd',
        },
    },
    typography: {
        fontFamily: 'AppleSDGothicNeo, Noto Sans KR, sans-serif',
    },
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Set login state based on token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [isLoggedIn]);

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    const RedirectIfLoggedIn = ({ children }) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
                <BrowserRouter>
                    <Routes>

                        {/* Redirect logged-in users away from the login page */}
                        <Route path="/login" element={
                            <RedirectIfLoggedIn>
                                <Login setIsLoggedIn={setIsLoggedIn} />
                            </RedirectIfLoggedIn>
                        } />
                        <Route path="/join" element={<Join />} />

                        <Route path= "/find-password" element={<FindPassword />} />
                        <Route path= "/find-username" element={<FindUsername />} />

                        {/* Protect routes that require authentication */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }>
                            {/*<Route path="community/questions" element={<PostListPage />} />*/}
                            {/*<Route path="community/questions/:postId" element={<PostDetailsPage />} />*/}
                            {/* Add other community routes as needed */}
                            {/* <Route path="community/general" element={<PostListPage />} /> */}
                            {/* <Route path="community/team-recruit" element={<PostListPage />} /> */}
                            <Route path= "/user/profile" element={<UserProfile />} />
                            <Route path= "/user/password" element={<UserPasswordUpdate/>} />
                            <Route path= "/user/update" element={<UserUpdate/>} />
                            <Route path= "/user/inquiry" element={<UserInquiry/>} />

                            <Route path="teams/:teamId" element={<StudyPage />}>
                                <Route path="study" element={<StudyListPage />} />
                                <Route path="study/:studyId" element={<StudyDetailPage />} />
                                <Route path="book/search" element={<BookListPage />} />
                                <Route path="book/search/:bookId" element={<BookDetailPage />} />
                                <Route path="questions" element={<PostListPage />} />
                                <Route path="questions/:postId" element={<PostDetailsPage />} />
                                <Route path="questions/:postId/edit" element={<PostEditPage />} />
                            </Route>
                        </Route>

                        {/* Redirect unknown routes to home if authenticated, else to login */}
                        <Route path="*" element={
                            isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />
                        } />
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;