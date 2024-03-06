import { Content } from "../components/About/Content";
import { Sidebar } from "../components/About/Sidebar";
import "../App.css";
import { Container, Nav } from "react-bootstrap";
import { LandingNavbar } from "../components/LandingNavbar";
import { DataProvider, TravelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";

export function About(): JSX.Element {

    useDocumentTitle('About');

    useEffect(() => {
        Promise.all([
            DataProvider.getInstance().loadData(),
            TravelDataProvider.getInstance().loadData()
        ]).catch(console.error);
    });

    return (
        <>
            <LandingNavbar />
            <Container>
                <Sidebar />
                <Content />
            </Container>
        </>
    );
}
