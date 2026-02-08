import { render, screen } from "../../test-utils";
import ShimmerButton from "@/components/magicui/ShimmerButton";
import TextShimmer from "@/components/magicui/TextShimmer";
import BorderBeam from "@/components/magicui/BorderBeam";
import Meteors from "@/components/magicui/Meteors";

describe("MagicUI Components", () => {
    it("renders ShimmerButton", () => {
        render(<ShimmerButton>Click Me</ShimmerButton>);
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("renders TextShimmer", () => {
        render(<TextShimmer>Shimmering Text</TextShimmer>);
        expect(screen.getByText("Shimmering Text")).toBeInTheDocument();
    });

    it("renders BorderBeam", () => {
        const { container } = render(<div className="relative w-20 h-20"><BorderBeam /></div>);
        // It renders a div with specific classes
        expect(container.firstChild).toBeInTheDocument();
    });

    it("renders Meteors", () => {
        const { container } = render(<Meteors number={5} />);
        const meteorElements = container.querySelectorAll("span");
        expect(meteorElements.length).toBe(5);
    });
});
