import { FormLabel } from './FormLabel'

export function OnboardingForm() {
  return (
    <form className="space-y-6" aria-label="Onboarding form">
      <div>
        <FormLabel htmlFor="userType">User Type</FormLabel>
        <select
          id="userType"
          name="userType"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          aria-label="Select user type"
          required
        >
          <option value="">Select your role</option>
          <option value="developer">Developer</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter your first name"
          required
          aria-required="true"
        />
      </div>

      <div>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter your last name"
          required
          aria-required="true"
        />
      </div>
    </form>
  )
}