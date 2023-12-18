import { useEffect, useState } from "react";

const InfoMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Clear the timeout to avoid memory leaks when the component unmounts or if the message changes
    return () => clearTimeout(timeoutId);
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        padding: "10px",
      }}
    >
      {message}
    </div>
  );
};

export default InfoMessage;
