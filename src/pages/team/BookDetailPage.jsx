import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    InputBase,
    Dialog,
    DialogContent,
    Card,
    CardContent,
    CardActions,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
    Avatar,
    Divider,
    Fab,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material';
import {useLocation, useParams} from "react-router-dom";
import PostCreationDialog from '../../components/content/community/PostCreationDialog.jsx';
import SearchComponent from "../../components/team/SearchComponent.jsx";
import AddIcon from "@mui/icons-material/Add";
import StudyCreatgionDialog from "../../components/team/StudyCreationDialog.jsx";
import bookProfileManAndSea from "../../assets/book-profile-man-and-sea.jpg";

const BookDetailPage = ({ isSmallScreen, isMediumScreen }) => {
    const theme = useTheme();
    const location = useLocation();
    const book = location.state.book;
    const params = useParams();
    const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

    const handleWriteButtonClick = () => {
        setIsStudyModalOpen(true);
    };

    const handleCloseStudyModal = () => {
        setIsStudyModalOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3,
                p: 2,
            }}
        >
            {/* Book Details Section */}
            <Grid2
                container
                spacing={5}
            >
                {/* Book Image Column */}
                <Grid2 item xs={12} md={4}>
                    <Box
                        component="img"
                        src={book.src}
                        alt={book.title}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'fit',
                            border: '1px solid #ddd',
                        }}
                    />
                </Grid2>

                {/* Book Info Column */}
                <Grid2
                    item
                    xs={12}
                    md={8}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {book.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {book.writer}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        책소개
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {book.description}
                    </Typography>
                </Grid2>
            </Grid2>

            {/* Book Description Section */}
            {/*<Box sx={{ mt: 4 }}>*/}

            {/*</Box>*/}

            {/* Floating Button for Team Study Creation */}
            <Fab
                color={theme.palette.secondary.main}
                aria-label="add"
                sx={{
                    position: 'absolute',// Changed to absolute to make Fab relative to parent Box
                    top: 16,
                    right: 16,
                }}
                onClick={handleWriteButtonClick}
            >
                <AddIcon />
            </Fab>

            {/* Post Creation Modal */}
            <StudyCreatgionDialog
                open={isStudyModalOpen}
                onClose={handleCloseStudyModal}
                selectedTeamId={params.teamId}
                selectedBook={book}
            />
        </Box>
    );
};

export default BookDetailPage;