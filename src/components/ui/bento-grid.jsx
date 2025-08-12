import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  path,
  //   icon
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        console.log("Clicked!", path);
        if (path) {
          navigate(path);
        }
      }}
      className={cn(
        `group/bento shadow-input row-span-1 ${
          title !== "" ? "flex flex-col justify-between" : ""
        } space-y-4 border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none`,
        className
      )}
    >
      {title !== "" && (
        <div className="transition duration-200 group-hover/bento:translate-x-2">
          <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
            {title}
          </div>
        </div>
      )}
      <>{header}</>
    </div>
  );
};
