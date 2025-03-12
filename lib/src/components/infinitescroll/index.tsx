import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface InfiniteScrollContextProps {
  isFetching: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

interface RootProps {
  children: React.ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

const InfiniteScrollCTX = createContext<InfiniteScrollContextProps | null>(
  null
);

const Root: React.FC<RootProps> = ({
  children,
  loadMore,
  hasMore,
  threshold = 300,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          setIsFetching(true);
          await loadMore();
          setIsFetching(false);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, loadMore, threshold]);

  return (
    <InfiniteScrollCTX.Provider value={{ isFetching, hasMore, observerRef }}>
      {children}
    </InfiniteScrollCTX.Provider>
  );
};

const List: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

const Loader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(InfiniteScrollCTX);
  if (!context)
    throw new Error("Loader must be used within an InfiniteScroll.Root");
  return context.isFetching ? children : null;
};

const EndMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(InfiniteScrollCTX);
  if (!context)
    throw new Error("EndMessage must be used within an InfiniteScroll.Root");
  return !context.hasMore ? children : null;
};

const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(InfiniteScrollCTX);
  if (!context)
    throw new Error("Trigger must be used within an InfiniteScroll.Root");
  return <div ref={context.observerRef}>{children}</div>;
};

export const InfiniteScroll = Object.assign(Root, {
  List,
  Loader,
  EndMessage,
  Trigger,
});
