// className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
//Create a button component that uses the passed in title and onClick function as props and uses the above style as a default style
//The button should be a button element with the passed in title as the text inside the button
//The button should have an onClick event that calls the passed in onClick function
//The button should have a className that uses the passed in className prop and the default style
//The button should have a type of button
//The button should have a disabled prop that is set to the passed in disabled prop

import React from "react";

interface ButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} type="button" disabled={false}>
      {title}
    </button>
  );
};

export default Button;
