import { createMachine } from 'npm:xstate';

// setup({
// 	types: {
// 		context: {} as InsertUser
// 	},
// 	schemas: {}
// })

export const machine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVAFATgewGM5YBLAOygDoA5MAdwGIAxAUQBUBhACQG0AGALqJQABzyl0JPGWEgAHogC0ARj4BOSsoAcAJgCsawwDZVAZi3LlAGhABPRMoDsGnUb4AWI0Z1q9Xx6ZGAL5BNmiYuITE5FRMYOgEABYxzOzcAPoAygCqHBwsmZn8QkggYhJSMqUKCCr6lLqOBqZOWo7K7lpqNvYIOo5alGpdykadRo7eTnohYRjY+ESwpBSUcQnJFKmcXOlMAIIAkgAy2QBKLMWy5SSS0rI1eu6UE0a+Bm7Kfp49iDo+Ly0gXcfA82jURj0M1CIHCCyiyxilBYcnQOFQBEkWxYAA02Gd9hw2FlcvlCldSjc7lVQDUVKY9JQ9LpTO01Ko9Ay-L8EKY1KYGu5zOpPB4-LNYfNIksVlQUWiMVioAxcfjCcSDidzpdBNdxLdKg9EO5nuzXnxlD4+I5OjzTHzKKDrapHGy2tC5hFFtFViwcPgcAwLviAJoU0T66lGhBdSg+NwjCH6NT9HmjPiOs18wI6XQ6L4SuHSn1UNjosiwABmeBwAFsUmrqJkmAB5M4AWRJeQKRV1lMjhuqSg6gyhamc7kcfC0IKeph5ej4AqB7S0b3aTlM+kLUu9iNWZdQFerdYbBKbrY7eyOpwu4bKA-uQ95yiG2aXWj0AyBS-ndmNTxDE8QI6C0+juAWEpkHgEBwLIRZ7rKeoVE+tLDhCTIGBOU4znwc48kKQzDKYHisjofD9Mopg7l6CKyjQ9DIQaqHyEoajPJa2h6KMaigtxThpi0mhaBaJgpuOnRAjR8Iyki6xJDETFRs+ijsZo+afjxfGWEYPL-BofCQiO-JNLm1EwghdFIvK6KYop-YoTSrG1OOcYBMM4zseoEx2uYlDmP8gRNF+lpPNJxb7nK-o1kpg5oQgyi8ZhRhaKlYxeJ07hpgYlCTi0pieN4XipVo4WIUih7HjW9YULFLF0qogwmCuriGZY7i+ARgH2kYW6TJa5gsmVVmrBweC1iIAA28SQHVTkNU4QxeK1E4TO0WX-ggUKDOynL9danhCiEIRAA */
	context: { slug: '' },
	id: 'DataProcessing',
	initial: 'New',
	states: {
		New: {
			on: {
				FETCH: {
					target: 'Fetching'
				}
			}
		},
		Fetching: {
			on: {
				FETCH_SUCCESS: {
					target: 'Extracting'
				},
				FETCH_FAILURE: {
					target: 'Error'
				}
			}
		},
		Extracting: {
			on: {
				EXTRACT_SUCCESS: {
					target: 'Transforming'
				},
				EXTRACT_FAILURE: {
					target: 'Error'
				}
			}
		},
		Error: {
			on: {
				RETRY: {
					target: 'Fetching'
				}
			}
		},
		Transforming: {
			on: {
				TRANSFORM_SUCCESS: {
					target: 'Completed'
				},
				TRANSFORM_FAILURE: {
					target: 'Error'
				}
			}
		},
		Completed: {
			type: 'final'
		}
	}
});

// export const actor = createActor(machine);

// actor.subscribe(() => {
// 	const state = actor.getPersistedSnapshot();
// 	console.log('Persisting', state);

// 	// UPDATE DB
// });
