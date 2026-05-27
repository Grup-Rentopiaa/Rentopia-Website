import {Button} from '@/components/ui/button'
import {Card,
  CardContent,
  CardFooter,
  CardHeader,} from '@/components/ui/card'
import {X} from 'lucide-react'
import { useState } from 'react'
import {Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

function CookieConsent() {

  const [visible, setVisible] = useState(localStorage.getItem('rentopia_cookie_consent') ? false : true)
  const [preferences, setPreferences] = useState({
    location: false,
    usageData: false, 
    advertising: false,
    personalPreferences: false,
  })  
  function handleAccept() {
    localStorage.setItem('rentopia_acookie_consent', 'accepted')
    setVisible(false) 
  }
  function handleSavePreferences() {
    localStorage.setItem('rentopia_cookie_consent', 'accepted')
    localStorage.setItem('rentopia_cookie_preferences', JSON.stringify(preferences))
    setVisible(false) 
  }
  if (!visible) return null

  return (
    <Card className="bg-black text-white w-96 fixed bottom-4 right-4">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-medium">We use cookies</h2>
        <Button onClick={() => setVisible(false)}>
          <X />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">We use cookies to improve your experience and show relevant ads via Google. Your data is never sold to third parties. We comply with Indonesia's Personal Data Protection Law (UU PDP).</p>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 w-full">
        <Button variant="secondary" className="flex-1" onClick={handleAccept}>
          Accept all
        </Button>

        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1">Manage preferences</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>
                Manage preferences
              </DialogTitle>
              <DialogDescription>
                Choose what data Rentopia can collect.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Device information</p>
                <p className="text-sm text-gray-400">Browser type, screen size, OS. Required for the app to display correctly.</p>
              </div>
              <span className="font-medium bg-green-500 text-white text-xs px-2 py-1 rounded shrink-0">Always on</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-400">used for nearby property search and maps.You can still use Rentpia without this.</p>
              </div>
              <Switch 
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                checked={preferences.location}
                onCheckedChange={(value) => setPreferences({...preferences, location: value})}
              />
            </div>
            <div className="flex justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Usage data</p>
                <p className="text-sm text-gray-400">Pages you visit and features you use. Helps us improve Rentopia.</p>
              </div>
              <Switch 
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                checked={preferences.usageData}
                onCheckedChange={(value) => setPreferences({...preferences, usageData: value})}
              />
            </div>
            <div className="flex justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Advertising</p>
                <p className="text-sm text-gray-400">Allows Google Ads to show relevant ads. Your data may be shared with Google.</p>
              </div>
              <Switch 
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                checked={preferences.advertising}
                onCheckedChange={(value) => setPreferences({...preferences, advertising: value})}
              />
            </div>
            <div className="flex justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Personal preferences</p>
                <p className="text-sm text-gray-400">Saved filters, language, and display settings.</p>
              </div>
              <Switch 
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                checked={preferences.personalPreferences}
                onCheckedChange={(value) => setPreferences({...preferences, personalPreferences: value})}
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" className="w-full" onClick={handleSavePreferences}>
                Save preferences
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </CardFooter>
      
    </Card>
    
  )
}

export default CookieConsent