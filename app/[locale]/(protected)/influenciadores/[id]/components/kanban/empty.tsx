import Logo from "@/components/partials/auth/logo";


const EmptyTask = () => {
  return (
    <div className=" absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Logo className="opacity-20 dark:invert" />
    <div className=' text-sm text-default-500 text-center'>Sem influencers</div>
    </div>
  );
};

export default EmptyTask;