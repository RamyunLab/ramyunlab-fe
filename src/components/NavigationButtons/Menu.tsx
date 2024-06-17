import React from "react";
import NavigationButton from "./NavigationButtons";

const Menu: React.FC = () => {
    const handleFavoriteListPage = () => {
        console.log("Navigating to Favorite List Page");
    };

    const handleMyReviewsPage = () => {
        console.log("Navigating to My Reviews Page");
    };

    const handleLikedReviewsPage = () => {
        console.log("Navigating to Liked Reviews Page");
    };

    const handleRecentlyViewedPage = () => {
        console.log("Navigating to Recently Viewed Page");
    };

    return (
        <div>
            <NavigationButton
                label="Favorite List"
                to="/FavoriteListPage"
                onClick={handleFavoriteListPage}
            />
            <NavigationButton
                label="My Reviews"
                to="/MyReviewsPage"
                onClick={handleMyReviewsPage}
            />
            <NavigationButton
                label="Liked Reviews"
                to="/LikedReviewsPage"
                onClick={handleLikedReviewsPage}
            />
            <NavigationButton
                label="Recently Viewed"
                to="/recently-viewed"
                onClick={handleRecentlyViewedPage}
            />
        </div>
    );
};

export default Menu;
