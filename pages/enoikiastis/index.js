import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        enoikiastes: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}

export default function EnoikiastisScreen() {
  const router = useRouter();

  const [
    {
      loading,
      error,
      enoikiastes,
      loadingCreate,
      successDelete,
      loadingDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    enoikiastes: [],
    error: '',
  });

  const {
    handleSubmit,
    register,

    watch,
    formState: { errors },
  } = useForm();

  const children = watch('children', 'no');
  const sex = watch('sex');
  const animals = watch('animals');
  const typeOfAnimals = watch('typeOfAnimals');
  const childrenBoys = watch('children.boys');
  const childrenGirls = watch('children.girls');

  const submitHandler = async ({
    name,
    slug,
    territory,
    tel,
    //image,
    age,
    children: {
      boys,
      girls,
      firstBoysAge,
      secondBoysAge,
      firstGirlsAge,
      secondGirlsAge,
    },
    animals: { cat, dog, other },
    rating,
    // numReviews,
    description,
  }) => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post('/api/enoikiastes', {
        name,
        slug,
        territory,
        tel,
        image: '/enikiastis_avatar.png',
        age,
        children: {
          boys,
          girls,
          firstBoysAge,
          secondBoysAge,
          firstGirlsAge,
          secondGirlsAge,
        },
        animals: { cat, dog, other },
        rating,
        numReviews: 8,
        description,
        orders: [],
      });
      dispatch({ type: 'CREATE_SUCCESS' });
      Cookies.set('cart', JSON.stringify(data));
      toast.success('Enoikiastis created');
      router.push(`/`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('api/enoikiastes');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (enoikiastisId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`api/enoikiastes/${enoikiastisId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Enoikiastis deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Enoikiastis">
      <div className="overflow-x-auto md:col-span-3">
        <div className="flex justify-between">
          <h1 className="mb-4 text-xl">Enoikiastes</h1>
          {loadingDelete && <div>Deleting item...</div>}

          {loadingCreate ? 'Loading' : 'Create'}
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <form
          className="mx-auto max-w-screen-md"
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-xl">Προσθήκη Ενοικιαστή</h1>
          <div className="mb-4">
            <label htmlFor="name">Όνομα</label>
            <input
              type="text"
              className="w-full"
              id="name"
              autoFocus
              {...register('name', {
                required: 'Παρακαλώ γράψτε το όνομά σας',
              })}
            />
            {errors.name && (
              <div className="text-red-500"> {errors.name.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              className="w-full"
              id="slug"
              {...register('slug', { required: 'Παρακαλώ γράψτε το slug σας' })}
            />
            {errors.slug && (
              <div className="text-red-500"> {errors.slug.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="territory">Περιοχή</label>
            <input
              type="text"
              className="w-full"
              id="territory"
              {...register('territory', {
                required: 'Παρακαλώ γράψτε το territory σας',
              })}
            />
            {errors.slug && (
              <div className="text-red-500"> {errors.territory.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="tel">Τηλέφωνο</label>
            <input
              type="number"
              className="w-full"
              id="tel"
              {...register('tel', {
                minLength: {
                  value: 10,
                  message: 'το τηλέφωνό περιέχει πάνω απο 9 αριθμούς',
                },
                required: 'Παρακαλώ γράψτε το τηλέφωνό σας',
              })}
            />
            {errors.tel && (
              <div className="text-red-500"> {errors.tel.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="tel">Ηλικία</label>
            <input
              type="number"
              className="w-full"
              id="age"
              {...register('age', {
                validate: (value) => value >= 0,
                required: 'Παρακαλώ γράψτε την ηλικία σας',
              })}
            />
            {errors.age && (
              <div className="text-red-500"> {errors.age.message}</div>
            )}
            {errors.age && errors.age.type === 'validate' && (
              <div className="text-red-500">
                Πρέπει να είναι θετικός αριθμός!!!!{' '}
              </div>
            )}
          </div>
          <div className="flex justify-start">
            <label className=" px-4" htmlFor="children">
              Έχετε παιδιά;
            </label>
            <div>
              {' '}
              <select
                name="children"
                {...register('children', {
                  required: 'πρεπει να διαλέξετε',
                })}
              >
                <option value="">--επιλογή--</option>
                <option value="yes">ναί</option>
                <option value="no">όχι</option>
              </select>
            </div>
          </div>
          {errors.children && (
            <div className="text-red-500"> {errors.children.message}</div>
          )}
          {children === 'no' || children === '' ? null : (
            <div>
              <label className="px-4 ">Φύλο</label>
              <select name="sex" {...register('sex')}>
                <option value="">φύλο...</option>
                <option value="boys">αγόρια</option>
                <option value="girls">κορίτσια</option>
                <option value="both">αγόρια και κορίτσια</option>
              </select>
            </div>
          )}
          {sex === 'boys' ? (
            <>
              <div className="text-xs">
                Παρακαλώ γράψτε το αριθμό των αγοριών ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="children.boys"
                {...register('children.boys', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσα αγόρια έχετε',
                })}
              />
              {errors.children?.boys && (
                <div className="text-red-500">
                  {' '}
                  {errors.children.boys?.message}
                </div>
              )}
              {errors.children?.boys &&
                errors.children?.boys.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}
            </>
          ) : null}
          {sex === 'girls' ? (
            <>
              {' '}
              <div className="text-xs">
                Παρακαλώ γράψτε το αριθμό των κοριτσιών ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="children.girls"
                {...register('children.girls', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσα κορίτσια έχετε',
                })}
              />
              {errors.children?.girls && (
                <div className="text-red-500">
                  {errors.children.girls?.message}
                </div>
              )}
              {errors.children?.girls &&
                errors.children?.girls.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}
            </>
          ) : null}
          {sex === 'both' ? (
            <>
              <div className="text-xs">
                Παρακαλώ γράψτε το αριθμό των αγοριών ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="children.boys"
                {...register('children.boys', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσα αγόρια έχετε',
                })}
              />
              {errors.children?.boys && (
                <div className="text-red-500">
                  {' '}
                  {errors.children.boys?.message}
                </div>
              )}
              {errors.children?.boys &&
                errors.children?.boys.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}{' '}
              <div className="text-xs">
                Παρακαλώ γράψτε το αριθμό των κοριτσιών ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="children.girls"
                {...register('children.girls', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσα κορίτσια έχετε',
                })}
              />
              {errors.children?.girls && (
                <div className="text-red-500">
                  {errors.children.girls?.message}
                </div>
              )}
              {errors.children?.girls &&
                errors.children?.girls.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}
            </>
          ) : null}

          {!childrenBoys ? null : childrenBoys === '0' ? null : childrenBoys &&
            childrenBoys === '1' ? (
            <div>
              <label htmlFor="children.firstBoysAge">Ηλικία 1ου αγοριού</label>
              <input
                type="number"
                className="w-full"
                id="children.firstBoysAge"
                {...register('children.firstBoysAge', {
                  validate: (value) => value >= 0,
                  required: 'Παρακαλώ γράψτε την ηλικία του 1ου αγοριού',
                })}
              />
              {errors.children?.firstBoysAge && (
                <div className="text-red-500">
                  {' '}
                  {errors.children?.firstBoysAge.message}
                </div>
              )}
              {errors.children?.firstBoysAge &&
                errors.children?.firstBoysAge.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!{' '}
                  </div>
                )}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="children.firstBoysAge">
                  Ηλικία 1ου αγοριού
                </label>
                <input
                  type="number"
                  className="w-full"
                  id="children.firstBoysAge"
                  {...register('children.firstBoysAge', {
                    validate: (value) => value >= 0,
                    required: 'Παρακαλώ γράψτε την ηλικία του 1ου αγοριού',
                  })}
                />
                {errors.children?.firstBoysAge && (
                  <div className="text-red-500">
                    {' '}
                    {errors.children?.firstBoysAge.message}
                  </div>
                )}
                {errors.children?.firstBoysAge &&
                  errors.children?.firstBoysAge.type === 'validate' && (
                    <div className="text-red-500">
                      Πρέπει να είναι θετικός αριθμός!!!!{' '}
                    </div>
                  )}
              </div>
              <div>
                <label htmlFor="children.secondBoysAge">
                  Ηλικία 2ου αγοριού
                </label>
                <input
                  type="number"
                  className="w-full"
                  id="children.secondBoysAge"
                  {...register('children.secondBoysAge', {
                    validate: (value) => value >= 0,
                    required: 'Παρακαλώ γράψτε την ηλικία του 2ου αγοριού',
                  })}
                />
                {errors.children?.secondBoysAge && (
                  <div className="text-red-500">
                    {' '}
                    {errors.children?.secondBoysAge.message}
                  </div>
                )}
                {errors.children?.secondBoysAge &&
                  errors.children?.secondBoysAge.type === 'validate' && (
                    <div className="text-red-500">
                      Πρέπει να είναι θετικός αριθμός!!!!{' '}
                    </div>
                  )}
              </div>
            </>
          )}
          {!childrenGirls ? null : childrenGirls ===
            '0' ? null : childrenGirls && childrenGirls === '1' ? (
            <div>
              <label htmlFor="children.firstGirlsAge">
                Ηλικία 1ου κοριτσιού
              </label>
              <input
                type="number"
                className="w-full"
                id="children.firstGirlsAge"
                {...register('children.firstGirlsAge', {
                  validate: (value) => value >= 0,
                  required: 'Παρακαλώ γράψτε την ηλικία του 1ου κοριτσιού',
                })}
              />
              {errors.children?.firstGirlsAge && (
                <div className="text-red-500">
                  {' '}
                  {errors.children?.firstGirlsAge.message}
                </div>
              )}
              {errors.children?.firstGirlsAge &&
                errors.children?.firstGirlsAge.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!{' '}
                  </div>
                )}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="children.firstGirlsAge">
                  Ηλικία 1ου κοριτσιού
                </label>
                <input
                  type="number"
                  className="w-full"
                  id="children.firstGirlsAge"
                  {...register('children.firstGirlsAge', {
                    validate: (value) => value >= 0,
                    required: 'Παρακαλώ γράψτε την ηλικία του 1ου κοριτσιού',
                  })}
                />
                {errors.children?.firstGirlsAge && (
                  <div className="text-red-500">
                    {' '}
                    {errors.children?.firstGirlsAge.message}
                  </div>
                )}
                {errors.children?.firstGirlsAge &&
                  errors.children?.firstGirlsAge.type === 'validate' && (
                    <div className="text-red-500">
                      Πρέπει να είναι θετικός αριθμός!!!!{' '}
                    </div>
                  )}
              </div>

              <div>
                <label htmlFor="children.secondGirlsAge">
                  Ηλικία 2ου κοριτσιού
                </label>
                <input
                  type="number"
                  className="w-full"
                  id="children.secondGirlsAge"
                  {...register('children.secondGirlsAge', {
                    validate: (value) => value >= 0,
                    required: 'Παρακαλώ γράψτε την ηλικία του 2ου κοριτσιού',
                  })}
                />
                {errors.children?.secondGirlsAge && (
                  <div className="text-red-500">
                    {' '}
                    {errors.children?.secondGirlsAge.message}
                  </div>
                )}
                {errors.children?.secondGirlsAge &&
                  errors.children?.secondGirlsAge.type === 'validate' && (
                    <div className="text-red-500">
                      Πρέπει να είναι θετικός αριθμός!!!!{' '}
                    </div>
                  )}
              </div>
            </>
          )}
          <div>
            <label className="px-4" htmlFor="animals">
              Έχετε ζώα;
            </label>
            <select
              name="animals"
              {...register('animals', {
                required: 'πρεπει να διαλέξετε',
              })}
            >
              <option value="">--επιλογή--</option>
              <option value="yes">ναί</option>
              <option value="no">όχι</option>
            </select>
          </div>
          {errors.animals && (
            <div className="text-red-500"> {errors.animals.message}</div>
          )}
          {animals === 'yes' ? (
            <div>
              <label className="px-4 ">Τί ζώα έχετε;</label>
              <select name="typeOfAnimals" {...register('typeOfAnimals')}>
                <option value="">--επιλογή--</option>
                <option value="dog">σκύλος</option>
                <option value="cat">γάτα</option>
                <option value="other">άλλο</option>
              </select>
            </div>
          ) : null}
          {typeOfAnimals === 'dog' ? (
            <>
              <div className="text-xs">
                Παρακαλώ γράψτε το αριθμό σκύλων που έχετε ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="animals.dog"
                {...register('animals.dog', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσα σκυλιά έχετε',
                })}
              />
              {errors.animals?.dog && (
                <div className="text-red-500">
                  {' '}
                  {errors.animals?.dog.message}
                </div>
              )}
              {errors.animals?.dog &&
                errors.animals?.dog.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}{' '}
            </>
          ) : typeOfAnimals === 'cat' ? (
            <>
              <div className="text-xs">
                Παρακαλώ γράψτε πόσες γάτες έχετε ή αφήστε κενό
              </div>
              <input
                type="number"
                className="w-full"
                id="animals.cat"
                {...register('animals.cat', {
                  validate: (value) => value >= 1,
                  required: 'Παρακαλώ γράψτε πόσες γάτες έχετε',
                })}
              />
              {errors.animals?.cat && (
                <div className="text-red-500">
                  {' '}
                  {errors.animals?.cat.message}
                </div>
              )}
              {errors.animals?.cat &&
                errors.animals?.cat.type === 'validate' && (
                  <div className="text-red-500">
                    Πρέπει να είναι θετικός αριθμός!!!!
                  </div>
                )}{' '}
            </>
          ) : typeOfAnimals === 'other' ? (
            <>
              <div className="text-xs">
                Παρακαλώ γράψτε το είδος του ζώου που έχετε ή αφήστε κενό
              </div>
              <input
                type="text"
                className="w-full"
                id="animals.other"
                name="animals.other"
                {...register('animals.other', {
                  required: 'Παρακαλώ γράψτε τί ζώα έχετε',
                })}
              />
              {errors.animals?.other && (
                <div className="text-red-500">
                  {' '}
                  {errors.animals?.other.message}
                </div>
              )}
            </>
          ) : null}
          <div>
            <label htmlFor="tel">Rating</label>
            <input
              type="number"
              className="w-full"
              id="rating"
              {...register('rating', {
                min: { value: 0, message: 'πρεπει να είναι θετικος αριθμος' },
                max: { value: 8, message: 'πρεπει να είναι απο 0 εως  8' },
                required:
                  'Παρακαλώ γράψτε την βαθμολογία σας απο το 0 εως το 8',
              })}
            />
            {errors.rating && (
              <div className="text-red-500"> {errors.rating.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name">Περιγραφή</label>
            <input
              type="textarea"
              className="w-full "
              id="description"
              {...register('description', {
                required: 'Παρακαλώ γράψτε τη περιγραφή σας',
              })}
            />
            {errors.description && (
              <div className="text-red-500"> {errors.description.message}</div>
            )}
          </div>
          <div className="mb-4">
            <button className="primary-button">Δημιουργία ενοικιαστή</button>
          </div>
        </form>
      )}{' '}
      {enoikiastes.map((enoikiastis) => (
        <ul className="card " key={enoikiastis._id}>
          <li>{enoikiastis._id.substring(20, 24)}</li>
          {enoikiastis.name}
          <li>
            {' '}
            <Link href={`/enoikiastes/${enoikiastis._id}`}>
              <a type="button" className="default-button">
                Edit
              </a>
            </Link>
          </li>{' '}
          <button
            onClick={() => deleteHandler(enoikiastis._id)}
            className="default-button"
            type="button"
          >
            Delete
          </button>
        </ul>
      ))}
    </Layout>
  );
}

EnoikiastisScreen.auth = true;
