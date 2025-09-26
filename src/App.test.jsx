import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
            screen.getByText("Shrt - Acortador de URLs")
        ).toBeInTheDocument();
    });

    test("submits form and shows success message", async () => {
        mockedAxios.post.mockResolvedValue({
            data: { short_url: "http://localhost:3000/abc123" },
        });

        render(<App />);

        const input = screen.getByPlaceholderText("Ingresa la URL a acortar");
        const button = screen.getByText("Acortar");

        fireEvent.change(input, { target: { value: "https://example.com" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("URL acortada:")).toBeInTheDocument();
        });
    });

    test("shows error message on failure", async () => {
        mockedAxios.post.mockRejectedValue({
            response: { data: { errors: { url: ["URL inválida"] } } },
        });

        render(<App />);

        const input = screen.getByPlaceholderText("Ingresa la URL a acortar");
        const button = screen.getByText("Acortar");

        fireEvent.change(input, { target: { value: "invalid-url" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("URL inválida")).toBeInTheDocument();
        });
    });
});
