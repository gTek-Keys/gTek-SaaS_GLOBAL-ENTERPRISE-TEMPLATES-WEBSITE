export default function Shell({children}:{children:React.ReactNode}){
  return (
    <div className='min-h-screen'>
      <nav className='p-3 border-b flex gap-3 text-sm'>
        <a href='/'>Home</a>
        <a href='/console'>Console</a>
        <a href='/console/vault'>Vault</a>
  <a href='/console/governance'>Governance</a>
      </nav>
      <div className='p-6'>{children}</div>
    </div>
  );
}
