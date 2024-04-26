import { HeaderContent } from "../components/Home/HeaderContent";
import "../App.css";
import { Container } from "react-bootstrap";
import { LandingNavbar } from "../components/LandingNavbar";
import { DataProvider, TravelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";
import { HomeIcons } from "../components/Home/HomeIcons";
import { HomeFeatures } from "../components/Home/HomeFeatures";
import Footer from "../components/Footer"

export function Home(): JSX.Element {

    useDocumentTitle('Home');

    useEffect(() => {
        Promise.all([
            DataProvider.getInstance().loadData(),
            TravelDataProvider.getInstance().loadData()
        ]).catch(console.error);
    });

    return (
        <>
            <LandingNavbar />
            <HeaderContent />
            <Container>
                <HomeIcons />
                <HomeFeatures />
            </Container>
            <Footer
                docRefID="SnaWZHT5yxieSlRV6WQ2_home"
                page="hasVisitedHomePage"
                expiry='homeExpiry'
                footerBackgroundcolor="white"
            />
        </>
    );
}