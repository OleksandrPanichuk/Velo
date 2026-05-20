import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Input, InputProps } from "../Input";

type PasswordInputProps = Omit<InputProps, "endAdornment">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	(props: PasswordInputProps, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<Input
				ref={ref}
				label="Password"
				type={showPassword ? "text" : "password"}
				placeholder="••••••••"
				autoComplete="current-password"
				endAdornment={
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="text-text-tertiary hover:text-text-secondary transition-colors"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOffIcon /> : <EyeIcon />}
					</button>
				}
				{...props}
			/>
		);
	},
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, type PasswordInputProps };
