function logout(redirect){
    if (redirect.startsWith('/admin')) {
        console.log('Removing admin token')
        document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        window.location.href = '/admin/auth';
    }else{
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login'
    }

}