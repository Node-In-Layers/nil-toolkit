import React, { StrictMode } from 'react'
import Home from './home/Pages/Home.js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { NodeInLayersContextProvider } from './NodeInLayersContext.js'
import MainLayout from "./Layouts/MainLayout.js"
import {ThemeProvider} from "@mui/material"
import { theme } from './theme.js'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NodeInLayersContextProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
              <Route element={<MainLayout/>}>
                <Route index element={<Home/>} />
              </Route>
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </NodeInLayersContextProvider>
  </StrictMode>,
)
