<template>
    <div class="container-fluid">
        <div class="row mb-2">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <a class="nav-link">
                                <RouterLink to="/">Home</RouterLink>
                            </a>
                            <a class="nav-link">
                                <RouterLink v-if="$server.loggedUserHasAccess($server.Components.ROLES, $server.Actions.VIEW)"
                                    to="/roles">Roles</RouterLink>
                            </a>
                            <a class="nav-link">
                                <RouterLink v-if="$server.loggedUserHasAccess($server.Components.POSITIONS, $server.Actions.VIEW)"
                                    to="/positions">Positions</RouterLink>
                            </a>
                            <a class="nav-link">
                                <RouterLink v-if="$server.loggedUserHasAccess($server.Components.USERS, $server.Actions.VIEW)"
                                    to="/users">Users</RouterLink>
                            </a>
                            <a class="nav-link">
                                <RouterLink v-if="$server.loggedUserHasAccess($server.Components.TESTS, $server.Actions.VIEW)"
                                    to="/tests">Tests</RouterLink>
                            </a>
                            <a class="nav-link">
                                <RouterLink v-if="$server.loggedUserHasAccess($server.Components.USERTESTS, $server.Actions.VIEW)"
                                    to="/user/tests">UserTests</RouterLink>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="container-fluid">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
