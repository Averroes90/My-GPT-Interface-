<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- Background Card -->
          <v-card
            class="position-relative"
            elevation="2"
          >
            I'm the background card
          </v-card>
  
          <!-- Foreground Card -->
          <v-card
            class="position-absolute"
            elevation="12"
            style="top: 20px; left: 20px;"
          >
            I'm the foreground card
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style scoped>
  .position-relative {
    position: relative;
  }
  
  .position-absolute {
    position: absolute;
  }
  </style>