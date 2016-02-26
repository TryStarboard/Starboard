import { r, redirect } from 'routility';

// export default (
//   <Router history={browserHistory}>
//     <Redirect from='/' to='/login'/>
//     <Route path='/login' component={Login}/>
//     <Route path='/dashboard' component={Dashboard}>
//       <IndexRoute component={Default} />
//       <Route path="/userprofile" component={UserProfile} />
//     </Route>
//   </Router>
// );

export default (
  r('/', 'root', [
    redirect('/', '/login'),
    r('/login', 'login'),
    r('/dashboard', 'dashboard'),
    r('/user-profile', 'user_profile'),
  ])
);
