<template>
  <div class="layout-home">

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
          <div class="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
            <div class="text-primary font-bold text-lg leading-tight">
              <h1>Sports Timing System</h1>
            </div>
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">
              {{ $t('home.welcome.title') }}
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              {{ $t('home.welcome.description') }}
            </div>
            <Button @click.prevent="$router.push({name: 'auth'})" :label="$t('home.welcome.join')" rounded class="mt-4" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-20 text-center">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col items-center gap-4">
            <div class="font-bold text-3xl leading-tight">
              <h2 class="text-surface-900 dark:text-surface-0">{{ $t('home.hiw.title') }}</h2>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-trophy !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p1title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p1description') }}</p>
              </div>
            </div>
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-align-justify !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p2title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p2description') }}</p>
              </div>
            </div>
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-users !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p3title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p3description') }}</p>
              </div>
            </div>
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-flag !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p4title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p4description') }}</p>
              </div>
            </div>
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-play !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p5title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p5description') }}</p>
              </div>
            </div>
            <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-chart-line !text-2xl lg:!text-3xl text-primary-500 dark:text-primary-400" />
                    </span>
              <div class="flex flex-col gap-1">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">{{ $t('home.hiw.p6title') }}</div>
                <p class="text-surface-500 dark:text-surface-400 leading-normal">{{ $t('home.hiw.p6description') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
          <div class="text-surface-700 dark:text-surface-100">
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight text-center mb-6">
              <h2>{{ $t('home.why.title') }}</h2>
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              <div>
                {{ $t('home.why.p1') }} <br/>
                {{ $t('home.why.p2') }} <br/>
                {{ $t('home.why.p3') }} <br/>
                {{ $t('home.why.p4') }} <br/>
                {{ $t('home.why.p5') }}
              </div>
              <div class="mt-6">
                {{ $t('home.why.end') }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
          <div class="text-surface-700 dark:text-surface-100">
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight text-center mb-6">
              {{ $t('home.for.title') }}
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              <ul>
                <li>{{ $t('home.for.p1') }}</li>
                <li>{{ $t('home.for.p2') }}</li>
                <li>{{ $t('home.for.p3') }}</li>
                <li>{{ $t('home.for.p4') }}</li>
                <li>{{ $t('home.for.p5') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
          <div class="text-surface-700 dark:text-surface-100">
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight text-center mb-6">
              {{ $t('home.getStarted.title') }}
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              <p>{{ $t('home.getStarted.description') }}</p>
              <div class="text-center mt-6">
                <Button :label="$t('home.getStarted.cta')" size="small" @click.prevent="$router.push({name: 'auth'})"/>
                {{ $t('home.getStarted.slogan') }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="mb-6">
      <template #content>
        <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1 relative">
          <div class="relative flex-1 z-20 flex items-center justify-center">
            <div class="flex items-center justify-center h-full">
              <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                <h2 class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 !leading-tight">
                  <span class="block">{{ $t('home.founder.title') }}</span>
                  <span class="block text-primary">{{ $t('home.founder.name') }}</span>
                </h2>

                <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                  {{ $t('home.founder.p1') }}
                </p>
                <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                  {{ $t('home.founder.p2') }}
                </p>
                <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                  {{ $t('home.founder.p3') }}
                </p>

                <div class="flex items-center gap-4 justify-center lg:justify-start">
                  <Button
                    @click.prevent="openInstagram"
                    icon="pi pi-instagram"
                    severity="secondary"
                    rounded
                    aria-label="Bookmark"
                  />
                  <Button
                    @click.prevent="openLinkedin"
                    icon="pi pi-linkedin"
                    severity="secondary"
                    rounded
                    aria-label="Bookmark"
                  />
                  <Button
                    @click.prevent="openStrava"
                    severity="secondary"
                    rounded
                    icon="pi"
                  >
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="strava-icon">
                      <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#F04F28"/>
                      <path d="M22.1701 20.0804L25.519 26.6904H30.4415L22.1701 10.3627L13.9 26.6904H18.8236L22.1701 20.0804Z" fill="white"/>
                      <path d="M27.9495 31.7029L25.457 26.785H21.7935L27.9495 38.9339L34.1012 26.785H30.4404L27.9495 31.7029Z" fill="#FFA780"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
            <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
            <img src="../assets/images/founder.jpg" alt="hero-1" class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
const openInstagram = () => {
  window.open("https://www.instagram.com/mihakonceptcorn", "_blank")
}

const openLinkedin = () => {
  window.open("https://www.linkedin.com/in/mihailfedorenko/", "_blank")
}

const openStrava = () => {
  window.open("https://www.strava.com/athletes/2737135", "_blank")
}
</script>

<style lang="scss" scoped>
.strava-icon {
  filter: grayscale(1);
}
</style>
