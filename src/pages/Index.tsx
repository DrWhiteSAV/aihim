const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <h1 className="text-8xl md:text-9xl font-bold text-foreground tracking-tight relative z-10 select-none">
        Ai<span className="text-primary">Him</span>
      </h1>
    </div>
  );
};

export default Index;
