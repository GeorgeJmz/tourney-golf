import {Box} from "@mui/material";
import {observer} from "mobx-react";
import "./MarqueeBackground.css";

interface MarqueeBackgroundProps {
    expanded: boolean;
}

const MarqueeBackground: React.FC<MarqueeBackgroundProps> = ({
    expanded
}) => {
    // Create an array to hold multiple marquees
    const text = new Array(10).fill("TEEBOXLEAGUE");
    const marquees = new Array(40).fill(null); // Change the number for more or fewer marquees

    return <div className="marquee-container">
    {marquees.map((_, index1) => (
      <div
        key={index1}
        className={(index1 % 2 === 0 ? "marquee ltr" : "marquee rtl") + (expanded ? " expanded" : "")}
        style={{
          animationDuration: 50 + Math.random() * 50 + "s",
          animationDelay: `${index1 * -2}s`,
        }}
      >
        {text.map((t, index2) => (
          <Box
            component="span"
            sx={{
              color: index1 % 2 === 0 ? "primary.main" : "secondary.main",
            }}
            key={index2}
          >
            {t}
          </Box>
        ))}
      </div>
    ))}
  </div>;
};

export default observer(MarqueeBackground);