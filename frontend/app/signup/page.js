import LoginPageLeftSide from '@/components/login/LoginPageLeftSide';
import RegisterComponent from '@/components/signup/RegisterComponent';

export default function page() {
  return (
    <main className='min-h-screen overflow-auto w-full bg-white'>
      <div className='w-[100%] min-[1921px]:w-[80%] mx-auto bg-white min-h-screen flex'>
        <LoginPageLeftSide />
        <RegisterComponent />
      </div>
    </main>
  )
}
