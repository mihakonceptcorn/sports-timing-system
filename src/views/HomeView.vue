<template>
  <div class="layout-home">

    <Card class="mb-6">
      <template #content>
        <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
          <div class="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
            <div class="text-primary font-bold text-lg leading-tight">
              Sports Timing System
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
              <span class="text-surface-900 dark:text-surface-0">{{ $t('home.hiw.title') }}</span>
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
              {{ $t('home.why.title') }}
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              ✅ No special hardware required — just smartphones <br>
              ✅ Runs in your mobile browser — no app installs <br>
              ✅ Real-time timing and results <br>
              ✅ Perfect for small or local MTB and enduro events <br>
              ✅ Easy to use for volunteers and small teams <br>
              <div class="mt-6">
                Whether you're organizing a local downhill race, an enduro series, or time-trial training sessions, Smart Timing gives you all the tools you need — without breaking the budget.
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
              Ideal for:
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              <ul>
                <li>🚵 Mountain bike races (MTB)</li>
                <li>⏱️ Enduro and time trial stages</li>
                <li>🏃 Individual-start events</li>
                <li>🧪 Practice sessions or test races</li>
                <li>👨‍👩‍👧‍👦 Community sports and youth events</li>
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
              Get Started in Minutes
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">
              <p>Smart Timing is the easiest way to bring accurate race timing to your event — no expensive RFID chips, no complex setup, no learning curve. Sign up, invite your team, and start your first race in just a few clicks.</p>
              <div class="text-center mt-6">
                <Button label="Join Now" size="small" @click.prevent="$router.push({name: 'auth'})"/> — it’s fast, simple, and built for grassroots racing.
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
</script>

<style lang="scss">

</style>
