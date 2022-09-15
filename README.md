Boilerplate auth server in express using mongoose and passport (local and jwt)

# Endpoints:

## POST signup

### request:

body: { email: string, password: string }

### response:

#### success:

200: { success: boolean, msg: string, token: string }

#### fail

400 body: {error: json object }
422 (email in use) body: { error: string }

## POST signin

### request:

body: { email: string, password: string }

### response:

#### success:

200: { success: boolean, msg: string, token: string }

#### fail

400 body: {error: json object }
