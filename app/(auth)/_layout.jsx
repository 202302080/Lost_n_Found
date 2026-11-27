import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


export default function Authlayout() {
  return (
    <>
    <StatusBar value="auto" />
    <Stack 
        screenOptions={{ headerShown: false, animation: "none" }}
    />

    </>
  )
}
