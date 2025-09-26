import { render, screen } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");
const mockedAxios = axios;

describe("App", () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: [] });
    });

    test("renders the app title", () => {
        render(<App />);
        expect(
            screen.getByText("Shrt")
        ).toBeInTheDocument();
    });

    test("renders create url form", async () => {
        render(<App />);

        expect(screen.getByPlaceholderText("https://ejemplo.com/una-url-muy-larga")).toBeInTheDocument();
        expect(screen.getByText("Acortar URL")).toBeInTheDocument();
        expect(screen.getByText("Crear URL corta")).toBeInTheDocument();
    });

    test("renders navigation links", async () => {
        render(<App />);

        expect(screen.getByText("Ver mis URLs")).toBeInTheDocument();
        expect(screen.getByText("Sobre RFC 1738")).toBeInTheDocument();
    });
});
